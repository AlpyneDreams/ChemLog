import React from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import dayjs from 'dayjs';
import { Row } from '../Util'
import GenericInput from './GenericInput'
import { useTheme } from 'react-native-paper'
import InputExpand from './InputExpand';

/**
 * Displays the current live time if no value is provided.
 */
export default function InputDate({value, onChange}) {
  const theme = useTheme()
  const [datePicker, showDate] = React.useState(false)
  const [timePicker, showTime] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(new Date())

  const tickClock = () => {
    setCurrentTime(new Date())
  }

  React.useEffect(() => {
    // If either modal is open, do not redraw
    if (timePicker || datePicker) return

    // On the next minute, tick the clock, and set an interval to keep ticking
    let interval
    const timeout = setTimeout(() => {
      // Update now, and then every minute 
      tickClock()
      interval = setInterval(tickClock, 60 * 1000)

    }, 1000 * (60 - dayjs().second()))

    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [datePicker, timePicker, currentTime])


  // Dim text if we're using current time
  let dimText = (value == null)
  let date = dayjs(value ?? currentTime)

  const updateTime = (e, val) => {
    if (e.type === 'dismissed') {
      val = value // old value
    } else if (e.type === 'neutralButtonPressed') {
      val = null
    }
    showTime(false)
    showDate(false)
    onChange(val)
  }

  return (<InputExpand title='Add time &amp; date' startOpen={true} icon='clock' style={{marginTop: 12}}>
    <GenericInput 
      label='Date'
      mode='flat'
      value={date.format('MMM D, YYYY')}
      focused={datePicker}
      style={{flex: 1}}
      dimText={dimText}
      onPress={() => showDate(true)}
    />
    {datePicker && (
      <DateTimePicker
        mode='date'
        value={date.toDate()}
        neutralButtonLabel='Today'
        onChange={updateTime}
      />
    )}
    <GenericInput 
      label='Time'
      mode='flat'
      value={date.format('HH:mm')}
      focused={timePicker}
      style={{marginStart: 8, flex: 1}}
      dimText={dimText}
      onPress={() => showTime(true)}
    />
    {timePicker && (
      <DateTimePicker
        mode='time'
        value={date.toDate()}
        neutralButtonLabel='Now'
        onChange={updateTime}
      />
    )}
  </InputExpand>)

}