using System.Collections;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using UnityEngine;

public class MusicHandler : MonoBehaviour
{
    GameObject musicObj;
    void Awake()
    {
        musicObj = GameObject.FindGameObjectWithTag("GameMusic");

        Debug.Log(SceneManager.GetActiveScene().name);
        DontDestroyOnLoad(this.gameObject);
     
    }

    /// <summary>
    /// Update is called every frame, if the MonoBehaviour is enabled.
    /// </summary>
    void Update()
    {
        if((SceneManager.GetActiveScene() == SceneManager.GetSceneByName("Shhhtout")) || (SceneManager.GetActiveScene() == SceneManager.GetSceneByName("LoadSave")))
        {
            Destroy(this.gameObject);
        }
    }

}
