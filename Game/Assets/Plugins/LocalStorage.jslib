mergeInto(LibraryManager.library, {

  GetLocalStorage: function (key) {
    let item = window.localStorage.getItem(Pointer_stringify(key))
    item = item || ""
    const bufferSize = lengthBytesUTF8(item) + 1;
    const buffer = _malloc(bufferSize);
    stringToUTF8(item, buffer, bufferSize);
    return buffer;
  },

  SetLocalStorage: function (key, value) {
    window.localStorage.setItem(Pointer_stringify(key), value)
  },
  
   Alert: function (value) {
      window.alert(Pointer_stringify(value))
    },

});