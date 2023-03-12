/* 
  Adapted from: https://github.com/fateh999/react-native-paper-dropdown v1.0.7

  MIT License
    Copyright (c) 2021 Fateh Farooqui

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

import {
  LayoutChangeEvent,
  ScrollView,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import {
  Checkbox,
  Divider,
  Menu,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import React, {
  ReactNode,
  forwardRef,
  useEffect,
  useState,
  useCallback,
  Fragment,
} from "react";
import { Theme } from "react-native-paper/lib/typescript/types";
import { TextInputProps } from "react-native-paper/lib/typescript/components/TextInput/TextInput";

type Without<T, K> = Pick<T, Exclude<keyof T, K>>;

export interface DropDownPropsInterface {
  visible: boolean;
  multiSelect?: boolean;
  onDismiss: () => void;
  showDropDown: () => void;
  value: any;
  setValue: (_value: any) => void;
  label?: string | undefined;
  placeholder?: string | undefined;
  mode?: "outlined" | "flat" | undefined;
  inputProps?: TextInputPropsWithoutTheme;
  list: Array<{
    label: string;
    value: string | number;
    custom?: ReactNode;
  }>;
  dropDownContainerMaxHeight?: number;
  dropDownContainerHeight?: number;
  activeColor?: string;
  theme?: Theme;
  dropDownStyle?: ViewStyle;
  dropDownItemSelectedTextStyle?: TextStyle;
  dropDownItemSelectedStyle?: ViewStyle;
  dropDownItemStyle?: ViewStyle;
  dropDownItemTextStyle?: TextStyle;
  accessibilityLabel?: string;
}

type TextInputPropsWithoutTheme = Without<TextInputProps, "theme">;

const DropDown = forwardRef<TouchableWithoutFeedback, DropDownPropsInterface>(
  (props, ref) => {
    const activeTheme = useTheme();
    const {
      multiSelect = false,
      visible,
      onDismiss,
      showDropDown,
      value,
      setValue,
      activeColor,
      mode,
      label,
      placeholder,
      inputProps,
      list,
      dropDownContainerMaxHeight,
      dropDownContainerHeight,
      theme,
      dropDownStyle,
      dropDownItemStyle,
      dropDownItemSelectedStyle,
      dropDownItemTextStyle,
      dropDownItemSelectedTextStyle,
      accessibilityLabel,
    } = props;
    const [displayValue, setDisplayValue] = useState("");
    const [inputLayout, setInputLayout] = useState({
      height: 0,
      width: 0,
      x: 0,
      y: 0,
    });

    const onLayout = (event: LayoutChangeEvent) => {
      setInputLayout(event.nativeEvent.layout);
    };

    useEffect(() => {
      if (multiSelect) {
        const _labels = list
          .filter((_) => value.indexOf(_.value) !== -1)
          .map((_) => _.label)
          .join(", ");
        setDisplayValue(_labels);
      } else {
        const _label = list.find((_) => _.value === value)?.label;
        if (_label) {
          setDisplayValue(_label);
        }
      }
    }, [list, value]);

    const isActive = useCallback(
      (currentValue: any) => {
        if (multiSelect) {
          return value.indexOf(currentValue) !== -1;
        } else {
          return value === currentValue;
        }
      },
      [value]
    );

    const setActive = useCallback(
      (currentValue: any) => {
        if (multiSelect) {
          const valueIndex = value.indexOf(currentValue);
          const values = value.split(",");
          if (valueIndex === -1) {
            setValue([...values, currentValue].join(","));
          } else {
            setValue(
              [...values].filter((value) => value !== currentValue).join(",")
            );
          }
        } else {
          setValue(currentValue);
        }
      },
      [value]
    );

    return (
      <Menu
        visible={visible}
        onDismiss={onDismiss}
        theme={theme}
        anchor={
          <View>
            <View pointerEvents={"none"} style={{position: 'absolute', width: '100%'}}>
              <TextInput
                value={displayValue}
                mode={mode}
                label={label}
                placeholder={placeholder}
                pointerEvents={"none"}
                theme={theme}
                right={
                  <TextInput.Icon icon="menu-down" />
                }
                {...inputProps}
              />
            </View>
            <TouchableRipple
              ref={ref}
              onPress={showDropDown}
              onLayout={onLayout}
              accessibilityLabel={accessibilityLabel}
            >          
              <View style={{height: 56}} />
            </TouchableRipple>
          </View>
        }
        style={{
          maxWidth: inputLayout?.width,
          width: inputLayout?.width,
          marginTop: inputLayout?.height,
          ...dropDownStyle,
        }}
      >
        <ScrollView
          bounces={false}
          style={{
            ...(dropDownContainerHeight
              ? {
                  height: dropDownContainerHeight,
                }
              : {
                  maxHeight: dropDownContainerMaxHeight || 200,
                }),
          }}
        >
          {list.map((_item, _index) => (
            <Fragment key={_item.value}>
              <TouchableRipple
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => {
                  setActive(_item.value);
                  if (onDismiss) {
                    onDismiss();
                  }
                }}
              >
                <Fragment>
                  <Menu.Item
                    titleStyle={{
                      color: isActive(_item.value)
                        ? activeColor || (theme || activeTheme).colors.primary
                        : (theme || activeTheme).colors.text,
                      ...(isActive(_item.value)
                        ? dropDownItemSelectedTextStyle
                        : dropDownItemTextStyle),
                    }}
                    title={_item.custom || _item.label}
                    style={{
                      flex: 1,
                      maxWidth: inputLayout?.width,
                      ...(isActive(_item.value)
                        ? dropDownItemSelectedStyle
                        : dropDownItemStyle),
                    }}
                  />
                  {multiSelect && (
                    <Checkbox.Android
                      theme={{
                        colors: { accent: activeTheme?.colors.primary },
                      }}
                      status={isActive(_item.value) ? "checked" : "unchecked"}
                      onPress={() => setActive(_item.value)}
                    />
                  )}
                </Fragment>
              </TouchableRipple>
              <Divider />
            </Fragment>
          ))}
        </ScrollView>
      </Menu>
    );
  }
);

export default DropDown;
