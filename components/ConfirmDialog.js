import React, { useState } from "react";
import { Portal, Dialog, Button, Paragraph } from "react-native-paper";


export default function ConfirmDialog({
  state, title, body, onAccept, onCancel,
  acceptLabel='Ok', cancelLabel='Cancel', children
}) {
  const [visible, setVisible] = state ?? useState(false)

  //const showDialog = () => setVisible(true)
  //const hideDialog = () => setVisible(false)

  const cancel = () => {
    setVisible(false)
    if (onCancel) onCancel()
  }

  const accept = () => {
    setVisible(false)
    if (onAccept) onAccept()
  }

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={cancel}>
        {title ? <Dialog.Title>{title}</Dialog.Title> : null}
        {body || children ? <Dialog.Content>
          {body ? <Paragraph>{body}</Paragraph> : null}
          {children}
        </Dialog.Content> : null}
        <Dialog.Actions>
          <Button onPress={cancel}>{cancelLabel}</Button>
          <Button onPress={accept}>{acceptLabel}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}