using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SessionManager : MonoBehaviour
{
    private string token;
    // Start is called before the first frame update
    public static SessionManager Instance { get; private set; }
    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(this);
            return;
        }
        
        Destroy(this);
    }

    public void SetToken(string token)
    {
        this.token = token;
    }

    public string GetToken()
    {
        return this.token;
    }
}
