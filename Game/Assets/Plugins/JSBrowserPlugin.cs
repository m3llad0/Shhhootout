using System.Runtime.InteropServices;

public static class JSBrowserPlugin
{
#if UNITY_WEBGL
    [DllImport("__Internal")]
    public static extern string GetLocalStorage(string key);
    
    [DllImport("__Internal")]
    public static extern void SetLocalStorage(string key, string value);

    [DllImport("__Internal")]
    public static extern void Alert(string value);
#endif
}
