using System;
using System.Collections;
using UnityEngine;
using UnityEngine.Networking;


public static class APIConnection
{
    public struct Result<T>
    {
        public bool ok;
        public T data;
        public RequestError error;
    }
    
    
    [Serializable]
    public  struct RequestError
    {
        public string message;
    }

    [Serializable]
    public struct LoginResponse
    {
        public string token;
    }
    
    [Serializable]
    public struct RegisterResponse
    {
        public string message;
    }

[Serializable]
    public struct User
    {
        public string user_id;
        public string username;
        public string email;
        
    }
    
    [Serializable]
    public struct Level
    {
        public string level_id; 
        public string description;
        public string create_date;
        public string name;
        public User user;
        public string jsonData;
    }

    public struct Wrapper<T>
    {
        public T[] items;
    }
    
    [Serializable]
    public struct DeleteLevelResponse 
    {
        public string message;
    }
    
    private const string BASE_URL = "http://192.168.1.7:8000";
    private const string LOGIN_URI = "/login";
    private const string LEVEL_URI = "/level";
    private const string LEVEL_TREND_URI = "/levels/trend";
    private const string REGISTER_URI = "/register";

    /// <summary>
    /// Attempts to Login the user with the given credentials
    /// </summary>
    /// <param name="account">It can be the username or email of the user</param>
    /// <param name="password"></param>
    /// <param name="callback"></param>
    /// <returns></returns>
    public static IEnumerator Login(string account, string password, Action<Result<LoginResponse>> callback)
    {
        WWWForm formData = new WWWForm();
        
        formData.AddField( "account", account);
        formData.AddField( "password", password );
        
        using UnityWebRequest www = UnityWebRequest.Post(BASE_URL + LOGIN_URI, formData);
      
        // We send our http request
        yield return www.SendWebRequest();

        Result<LoginResponse> result = new Result<LoginResponse>();
        
        // Check for errors
        if (www.result != UnityWebRequest.Result.Success)
        {
            RequestError err = JsonUtility.FromJson<RequestError>(www.downloadHandler.text);
            // Set Result
            result.ok = false;
            result.error = err;
        }
        else
        {
            LoginResponse response = JsonUtility.FromJson<LoginResponse>(www.downloadHandler.text);
            result.data = response;
            result.ok = true;
        }

        callback(result);
        
    }

    /// <summary>
    /// Attempts to create an account for a user
    /// </summary>
    /// <param name="username"></param>
    /// <param name="email"></param>
    /// <param name="password"></param>
    /// <param name="callback"></param>
    /// <returns></returns>
    public static IEnumerator Register(string username, string email, string password, Action<Result<RegisterResponse>> callback)
    {
        WWWForm formData = new WWWForm();
        
        formData.AddField( "username", username);
        formData.AddField("email", email );
        formData.AddField( "password", password);
        
        using UnityWebRequest www = UnityWebRequest.Post(BASE_URL + REGISTER_URI, formData);
      
        // We send our http request
        yield return www.SendWebRequest();
        
        Result<RegisterResponse> result = new Result<RegisterResponse>();

        // Check for errors
        if (www.result != UnityWebRequest.Result.Success)
        {
            RequestError err = JsonUtility.FromJson<RequestError>(www.downloadHandler.text);
            // Set Result
            result.ok = false;
            result.error = err;
        }
        else
        {
            RegisterResponse response = JsonUtility.FromJson<RegisterResponse>(www.downloadHandler.text);
            result.data = response;
            result.ok = true; 
        }

        callback(result);
    }

    /// <summary>
    /// Retrieves a level based on its ID
    /// </summary>
    /// <param name="levelID"></param>
    /// <param name="callback"></param>
    /// <returns></returns>
    public static IEnumerator GetLevel(string levelID, Action<Result<Level>> callback)
    {

        string escLevel = UnityWebRequest.EscapeURL(levelID);
        
        using UnityWebRequest www = UnityWebRequest.Get(BASE_URL + LOGIN_URI + "/" + escLevel);
      
        // We send our http request
        yield return www.SendWebRequest();

        Result<Level> result = new Result<Level>();
        
        // Check for errors
        if (www.result != UnityWebRequest.Result.Success)
        {
            RequestError err = JsonUtility.FromJson<RequestError>(www.downloadHandler.text);
            // Set Result
            result.ok = false;
            result.error = err;
        }
        else
        {
            Level response = JsonUtility.FromJson<Level>(www.downloadHandler.text);
            result.data = response;
            result.ok = true;
        }

        callback(result); 
    } 
  
    /// <summary>
    /// Creates a level for an authenticated user
    /// </summary>
    /// <param name="levelID"></param>
    /// <param name="callback"></param>
    /// <returns></returns>
    public static IEnumerator CreateLevel(string jsonData, Action<Result<RegisterResponse>> callback)
    {
        throw new NotImplementedException();
    } 
    
    /// <summary>
    /// 
    /// </summary>
    /// <param name="levelID"></param>
    /// <param name="callback"></param>
    /// <returns></returns>
    public static IEnumerator UpdateLevel(string levelID, Action<Result<RegisterResponse>> callback)
    {
        throw new NotImplementedException(); 
    } 
    
    /// <summary>
    /// 
    /// </summary>
    /// <param name="levelID"></param>
    /// <param name="token"></param>
    /// <param name="callback"></param>
    /// <returns></returns>
    public static IEnumerator DeleteLevel(string levelID, string token, Action<Result<DeleteLevelResponse>> callback)
    {
        string escLevel = UnityWebRequest.EscapeURL(levelID);
        
        using UnityWebRequest www = UnityWebRequest.Delete(BASE_URL + LOGIN_URI + "/" + escLevel);
        www.SetRequestHeader("authorization", "Bearer " + token);
        
        // We send our http request
        yield return www.SendWebRequest();

        Result<DeleteLevelResponse> result = new Result<DeleteLevelResponse>();
        
        // Check for errors
        if (www.result != UnityWebRequest.Result.Success)
        {
            RequestError err = JsonUtility.FromJson<RequestError>(www.downloadHandler.text);
            // Set Result
            result.ok = false;
            result.error = err;
        }
        else
        {
            DeleteLevelResponse response = JsonUtility.FromJson<DeleteLevelResponse>(www.downloadHandler.text);
            result.data = response;
            result.ok = true;
        }

        callback(result);  
    } 

    /// <summary>
    /// 
    /// </summary>
    /// <param name="levelID"></param>
    /// <param name="callback"></param>
    /// <returns></returns>
    public static IEnumerator RateLevel(string levelID, string token ,Action<Result<RegisterResponse>> callback)
    {
        throw new NotImplementedException(); 
    } 
   
    /// <summary>
    /// Get a list of trending levels
    /// </summary>
    /// <param name="levelID"></param>
    /// <param name="callback"></param>
    /// <returns></returns>
    public static IEnumerator GetTrendingLevels(Action<Result<Level[]>> callback)
    {
        
        using UnityWebRequest www = UnityWebRequest.Get(BASE_URL + LEVEL_TREND_URI);
      
        // We send our http request
        yield return www.SendWebRequest();

        Result< Level[] > result = new Result< Level[]>();
        
        // Check for errors
        if (www.result != UnityWebRequest.Result.Success)
        {
            RequestError err = JsonUtility.FromJson<RequestError>(www.downloadHandler.text);
            // Set Result
            result.ok = false;
            result.error = err;
        }
        else
        {
        
            Wrapper<Level> response = JsonUtility.FromJson<Wrapper<Level>>( "{\"items\":"  + www.downloadHandler.text + "}");
            result.data = response.items;
            result.ok = true;
        }

        callback(result);  
    } 
    
    
}
