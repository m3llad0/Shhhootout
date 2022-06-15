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
  public struct RequestError
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
public struct InteractResponse
{
  public string message;
}
  
  [Serializable]
  public struct CreateResponse
  {
    public string message;
  }

  [Serializable]
  public struct CreateSessionResponse
  {
    public string session_id;

  }

    [Serializable]
  public struct CreateScoreResponse
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

    public int likes;
    public User user;
    public LevelData level_data;
  }

  [Serializable]
  public struct CreateLevelRequest
  {
    public string name;
    public string description;
    public string level_data;
  }

  [Serializable]
  public struct CreateScoreRequest
  {
    public string level_id;
    public string session_id;
    public double time;
    public bool completed;
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

  [Serializable]
  public struct RateLevelRequest
  {
    public bool like;
  }

  private const string BASE_URL = "https://api.shhootout.tk";
  private const string LOGIN_URI = "/login";
  private const string LEVEL_URI = "/level";
  private const string LEVEL_TREND_URI = "/levels/trend";
  private const string REGISTER_URI = "/register";

  private const string INTERACT_URI = "/interact";

  private const string SESSION_URI = "/session";

  private const string SCORE_URI = "/score";

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

    formData.AddField("account", account);
    formData.AddField("password", password);

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

    formData.AddField("username", username);
    formData.AddField("email", email);
    formData.AddField("password", password);

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

    using UnityWebRequest www = UnityWebRequest.Get(BASE_URL + LEVEL_URI + "/" + escLevel);

    // We send our http request
    yield return www.SendWebRequest();

    Result<Level> result = new Result<Level>();
    Debug.Log(www.downloadHandler.text);
    // Check for errors
    if (www.result != UnityWebRequest.Result.Success)
    {
      Debug.Log(www.downloadHandler.text);
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
  /// <param name="request"></param>
  /// <param name="callback"></param>
  /// <returns></returns>
  public static IEnumerator CreateLevel(CreateLevelRequest request, Action<Result<CreateResponse>> callback)
  {

    if (SessionManager.Instance == null)
    {
      var response = new Result<CreateResponse>();
      response.ok = false;

      var err = new RequestError();
      err.message = "Unauthenticated";
      
      response.error = err;
      callback(response);
      yield break;
      
    }
    
    string payload = JsonUtility.ToJson(request);
    using UnityWebRequest www = UnityWebRequest.Put(BASE_URL + LEVEL_URI, System.Text.Encoding.UTF8.GetBytes(payload));
    www.method = "POST";
    www.SetRequestHeader("Content-Type", "application/json");
    www.SetRequestHeader("authorization", "Bearer " + SessionManager.Instance.GetToken());

    // We send our http request
    yield return www.SendWebRequest();

    Result<CreateResponse> result = new Result<CreateResponse>();

    // Check for errors
    if (www.result != UnityWebRequest.Result.Success)
    {
      Debug.Log(www.downloadHandler.text);

      try
      {
        RequestError err = JsonUtility.FromJson<RequestError>(www.downloadHandler.text);
        result.error = err;
      }
      catch (Exception e)
      {
        var err = new RequestError();
        err.message = www.downloadHandler.text;
        result.error = err;
      }
    
      // Set Result
      result.ok = false;
    }
    else
    {
      CreateResponse response = JsonUtility.FromJson<CreateResponse>(www.downloadHandler.text);
      result.data = response;
      result.ok = true;
    }

    callback(result);
  }

  /// <summary>
  /// Creates a level for an authenticated user
  /// </summary>
  /// <param name="request"></param>
  /// <param name="callback"></param>
  /// <returns></returns>
  public static IEnumerator CreateScore(CreateScoreRequest request, Action<Result<CreateScoreResponse>> callback)
  {

    if (SessionManager.Instance == null)
    {
      var response = new Result<CreateScoreResponse>();
      response.ok = false;

      var err = new RequestError();
      err.message = "Unauthenticated";
      
      response.error = err;
      callback(response);
      yield break;
      
    }
    
    string payload = JsonUtility.ToJson(request);
    using UnityWebRequest www = UnityWebRequest.Put(BASE_URL + SCORE_URI, System.Text.Encoding.UTF8.GetBytes(payload));
    www.method = "POST";
    www.SetRequestHeader("Content-Type", "application/json");
    www.SetRequestHeader("authorization", "Bearer " + SessionManager.Instance.GetToken());

    // We send our http request
    yield return www.SendWebRequest();

    Result<CreateScoreResponse> result = new Result<CreateScoreResponse>();

    // Check for errors
    if (www.result != UnityWebRequest.Result.Success)
    {
      Debug.Log(www.downloadHandler.text);

      try
      {
        RequestError err = JsonUtility.FromJson<RequestError>(www.downloadHandler.text);
        result.error = err;
      }
      catch (Exception e)
      {
        var err = new RequestError();
        err.message = www.downloadHandler.text;
        result.error = err;
      }
    
      // Set Result
      result.ok = false;
    }
    else
    {
      CreateScoreResponse response = JsonUtility.FromJson<CreateScoreResponse>(www.downloadHandler.text);
      result.data = response;
      result.ok = true;
    }

    callback(result);
  }


  /// <summary>
  /// Creates a session for an authenticated user
  /// </summary>
  /// <param name="request"></param>
  /// <param name="callback"></param>
  /// <returns></returns>
  public static IEnumerator CreateSession( Action<Result<CreateSessionResponse>> callback)
  {

    if (SessionManager.Instance == null)
    {
      var response = new Result<CreateSessionResponse>();
      response.ok = false;

      var err = new RequestError();
      err.message = "Unauthenticated";
      
      response.error = err;
      callback(response);
      yield break;
      
    }
    
    
    using UnityWebRequest www = new UnityWebRequest(BASE_URL + SESSION_URI);
    www.downloadHandler = new DownloadHandlerBuffer();
    www.method = "POST";
    www.SetRequestHeader("Content-Type", "application/json");
    www.SetRequestHeader("authorization", "Bearer " + SessionManager.Instance.GetToken());

    // We send our http request
    yield return www.SendWebRequest();

    Result<CreateSessionResponse> result = new Result<CreateSessionResponse>();

    // Check for errors
    if (www.result != UnityWebRequest.Result.Success)
    {
      Debug.Log(www.downloadHandler.text);

      try
      {
        RequestError err = JsonUtility.FromJson<RequestError>(www.downloadHandler.text);
        result.error = err;
      }
      catch (Exception e)
      {
        var err = new RequestError();
        err.message = www.downloadHandler.text;
        result.error = err;
      }
    
      // Set Result
      result.ok = false;
    }
    else
    {
      Debug.Log("SUCCESS: ");
      Debug.Log(www.downloadHandler.text);
      CreateSessionResponse response = JsonUtility.FromJson<CreateSessionResponse>(www.downloadHandler.text);
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
  public static IEnumerator DeleteLevel(string levelID, Action<Result<DeleteLevelResponse>> callback)
  {
    
    if (SessionManager.Instance == null)
    {
      var response = new Result<DeleteLevelResponse>();
      response.ok = false;

      var err = new RequestError();
      err.message = "Unauthenticated";
      
      response.error = err;
      callback(response);
      yield break;
      
    }
    
    string escLevel = UnityWebRequest.EscapeURL(levelID);

    using UnityWebRequest www = UnityWebRequest.Delete(BASE_URL + LOGIN_URI + "/" + escLevel);
    www.SetRequestHeader("authorization", "Bearer " + SessionManager.Instance.GetToken());

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
  public static IEnumerator RateLevel(RateLevelRequest request, string level_id, Action<Result<InteractResponse>> callback)
  {
    if (SessionManager.Instance == null)
    {
      var response = new Result<InteractResponse>();
      response.ok = false;

      var err = new RequestError();
      err.message = "Unauthenticated";
      
      response.error = err;
      callback(response);
      yield break;
      
    }
    
    string payload = JsonUtility.ToJson(request);
    using UnityWebRequest www = UnityWebRequest.Put(BASE_URL + LEVEL_URI + "/"+ level_id + INTERACT_URI, System.Text.Encoding.UTF8.GetBytes(payload));
    www.method = "POST";
    www.SetRequestHeader("Content-Type", "application/json");
    www.SetRequestHeader("authorization", "Bearer " + SessionManager.Instance.GetToken());

    // We send our http request
    yield return www.SendWebRequest();

    Result<InteractResponse> result = new Result<InteractResponse>();

    // Check for errors
    if (www.result != UnityWebRequest.Result.Success)
    {
      Debug.Log(www.downloadHandler.text);

      try
      {
        RequestError err = JsonUtility.FromJson<RequestError>(www.downloadHandler.text);
        result.error = err;
      }
      catch (Exception e)
      {
        var err = new RequestError();
        err.message = www.downloadHandler.text;
        result.error = err;
      }
    
      // Set Result
      result.ok = false;
    }
    else
    {
      InteractResponse response = JsonUtility.FromJson<InteractResponse>(www.downloadHandler.text);
      result.data = response;
      result.ok = true;
    }

    callback(result);
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

    Result<Level[]> result = new Result<Level[]>();

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

      Wrapper<Level> response = JsonUtility.FromJson<Wrapper<Level>>("{\"items\":" + www.downloadHandler.text + "}");
      result.data = response.items;
      result.ok = true;
    }

    callback(result);
  }

  /// <summary>
  /// Get a list of player levels
  /// </summary>
  /// <param name="levelID"></param>
  /// <param name="callback"></param>
  /// <returns></returns>
  public static IEnumerator GetLevels(Action<Result<Level[]>> callback)
  {

    if (SessionManager.Instance == null)
    {
      var response = new Result<Level[]>();
      response.ok = false;

      var err = new RequestError();
      err.message = "Unauthenticated";
      
      response.error = err;
      callback(response);
      yield break;
      
    }
    
    using UnityWebRequest www = UnityWebRequest.Get(BASE_URL + LEVEL_URI);
    www.SetRequestHeader("authorization", "Bearer " + SessionManager.Instance.GetToken());

    // We send our http request
    yield return www.SendWebRequest();

    Result<Level[]> result = new Result<Level[]>();

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

      Wrapper<Level> response = JsonUtility.FromJson<Wrapper<Level>>("{\"items\":" + www.downloadHandler.text + "}");
      result.data = response.items;
      result.ok = true;
    }

    callback(result);
  }

}
