import React, { useRef } from 'react';
import { Alert, Platform, Text } from 'react-native';
import WebView from 'react-native-webview'
const ckeditor = require('../editor');

const CKEditor5 = ({
                     onError,
                     renderError,
                     onChange,
                     initialData,
                     renderLoading,
                     disableTooltips,
                     height,
                     androidHardwareAccelerationDisabled,
                     fontFamily,
                     colors,
                     toolbarBorderSize,
                     editorFocusBorderSize,
                     placeHolderText,
                     maxHeight,
                     editorConfig,
                     style,
                     onFocus,
                     onBlur
                   }) => {
  const webviewRef = useRef(null);

  const handleOnError = error => {
    if (onError) {
      onError(error);
    } else {
      Alert.alert('WebView onError', error, [
        { text: 'OK', onPress: () => console.log('OK Pressed') }
      ]);
    }
  };

  const handleRenderError = error => {
    if (renderError) {
      renderError(error);
    } else {
      return <Text>Unable to run editor</Text>;
    }
  };

  const handleMessage = event => {
    const data = event.nativeEvent.data;
    if (data.indexOf('RNCKEditor5') === 0) {
      const [cmdTag, cmd, value] = data.split(':');
      switch (cmd) {
        case 'onFocus':
          if (value === 'true' && onFocus) onFocus();
          if (value === 'false' && onBlur) onBlur();
          return;
      }
    }
    console.log('Data from ckeditor:', data);
    onChange(data);
  };

  const blur = () => {
    webviewRef.current.injectJavaScript(`document.querySelector( '.ck-editor__editable' ).blur()`);
  };

  return (
    <WebView
      ref={webviewRef}
      style={style}
      scrollEnabled={false}
      source={{baseUrl: Platform.OS === 'android' ? '' : undefined, html: `
      <!DOCTYPE html>
      <html>

      <head>
          <meta charset="utf-8">
          <title>CKEditor</title>
          <script>
            ${ckeditor}
          </script>
          <script>
            document.addEventListener("message", function(data) {
              console.log(data.data);
              editor.setData(data.data);
            });
          </script>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <style>
            .ck-editor__editable {
                height: ${height}px;
                max-height: ${maxHeight || height}px;
            }
            .ck.ck-editor__main>.ck-editor__editable {
              background: ${colors.backgroundColor};
              color: ${colors.white};
              font-family: ${fontFamily || '-apple-system, "Helvetica Neue", "Lucida Grande"'};
              border-style: none;
            }
            .ck .ck-toolbar {
              background: ${colors.offContentBackground};
              border: ${toolbarBorderSize};
            }
            .ck.ck-reset_all, .ck.ck-reset_all * {
              color: ${colors.white}
            }
            .ck.ck-editor__editable:not(.ck-editor__nested-editable).ck-focused {
              border: ${editorFocusBorderSize};
            }
            .ck-toolbar .ck-on .ck.ck-icon, .ck-toolbar .ck-on .ck.ck-icon * { 
              color: ${colors.bg5} !important; 
            }
            .ck-toolbar .ck-button:hover .ck.ck-icon, .ck-toolbar .ck-button:hover .ck.ck-icon * {
              color: ${colors.bg5}; 
            }
            ${disableTooltips ? `
            .ck.ck-button .ck.ck-tooltip {
                display: none;
            }
            ` : ''}
          </style>
      </head>

      <body>
      <textarea name="editor1" placeholder="${placeHolderText}" id="editor1"></textarea>
      <script>
      ClassicEditor
          .create( document.querySelector( '#editor1' ), ${JSON.stringify(editorConfig || {})} )
          .then( editor => {
              console.log( editor );
              window.editor = editor;
              editor.model.document.on('change:data', () => {
                try {
                  window.ReactNativeWebView.postMessage(editor.getData())
                }
                catch (e) {
                  alert(e)
                }
              } );
              editor.editing.view.document.on( 'change:isFocused', ( evt, name, value ) => {
                  console.log( 'editable isFocused =', value );
                  window.ReactNativeWebView.postMessage('RNCKEditor5:onFocus:' + value);
              } );
          } )
          .catch( error => {
              console.error( error );
          } );
      </script>
      </body>

      </html>

      `}}
      onError={handleOnError}
      renderError={handleRenderError}
      javaScriptEnabled
      injectedJavaScript={initialData ? `window.editor.setData(\`${initialData.replace('\'', '\\\'')}\`); true;` : null}
      onMessage={handleMessage}
      renderLoading={renderLoading}
      androidHardwareAccelerationDisabled={androidHardwareAccelerationDisabled}
    />
  );
};

export default CKEditor5;
