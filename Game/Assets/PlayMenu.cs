using System.Collections;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using UnityEngine;

public class PlayMenu : MonoBehaviour
{
    public void OnClick()
    {
        SceneManager.LoadScene("Play", LoadSceneMode.Single);
    }
}
