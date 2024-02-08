import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View ,StyleSheet} from "react-native";
import CKEditor5 from "./Component/CKEditor5";


const App =()=>{
  const [inputText,setInputText]=useState('')
  const colors = {
    backgroundColor: '#FBF9F1',
    offContentBackgroundColor: '#1F2544',
    color: '#000',
    bg5: '#BED1CF'
  }
  return (
    <View style={styles.mainContainer}>
      <CKEditor5
        initialData={inputText}
        onChange={(value)=>setInputText(value.replace(/<[^>]*>/g, ''))}
        editorConfig={{ toolbar: ['bold', 'italic', 'underline', 'bulletedList', 'numberedList', '|', 'undo', 'redo'] }}
        onFocus={() => {}}
        onBlur={() => {}}
        fontFamily={"'Roboto', sans-serif"}
        style={styles.inputText}
        height={600}
        colors={colors}
        toolbarBorderSize="0px"
        editorFocusBorderSize="0px"
        placeHolderText="Enter text here..."
      />
      <TouchableOpacity style={styles.submitButton} onPress={()=>{
        Alert.alert(inputText)
      }}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  )
}

export default App;
const styles=StyleSheet.create({
  mainContainer:{
      flex:1
  },
  inputText:{ backgroundColor: 'transparent'},
  submitText:{color:'#1D2B53'},
  submitButton:{
    marginHorizontal:80,
    borderRadius:20,
    padding:12,
    marginBottom:10,
    backgroundColor:'#92C7CF',
    alignItems:'center'
  }
})
