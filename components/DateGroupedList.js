import React, {useEffect, useState} from 'react'
import { separateByDate } from '../util/Util'
import { List, ActivityIndicator, useTheme } from 'react-native-paper'
import dayjs, { CALENDAR_DATE_ONLY_MEDIUM } from '../util/dayjs'

// TODO: Use this in DoseList?
export default function DateGroupedList({items, entry = (item, index) => null}) {
  const theme = useTheme()
  const [list, setList] = useState(null)

  useEffect(() => {
    setList(separateByDate(items))
  }, [])

  return (<>
    {!list && <ActivityIndicator/>}
    {list && list.map((item, index) => 
      item.type === 'date' ?
        <List.Subheader key={item.date}>{dayjs(item.date).calendar(null, CALENDAR_DATE_ONLY_MEDIUM)}</List.Subheader>
      :
        entry(item, index)
    )}
  </>)
}