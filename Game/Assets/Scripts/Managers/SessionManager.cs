using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SessionManager : MonoBehaviour
{
    private string token = "";
    private string session_id = "";
    // Start is called before the first frame update
    public static SessionManager Instance { get; private set; }
    public GameObject loginOverlay; 
    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(this);
            
        #if !UNITY_EDITOR && UNITY_WEBGL
            string token = JSBrowserPlugin.GetLocalStorage("token");
            if (token != "")
            {
                SetToken(token);
                return; 
            }
            #endif
            /*Aparecer overlay login*/
            EnableLoginOverlay();
            return;
        }
        
        Destroy(this);
    }
    public void SetToken(string token)
    {
        this.token = token;
      
    #if !UNITY_EDITOR && UNITY_WEBGL
        JSBrowserPlugin.SetLocalStorage("token", token);  
    #endif 
    }

    public string GetToken()
    {
        return this.token;
    }

    public void SetSession(string session_id)
    {
        this.session_id = session_id;
    }

    public string GetSession()
    {
        return this.session_id;
    }
    public void EnableLoginOverlay()
    {
        loginOverlay.SetActive(true);
    }
}
