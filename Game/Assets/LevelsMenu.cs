using System.Collections;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using UnityEngine;

public class LevelsMenu : MonoBehaviour
{
    /*Load levels select
    Electronic Rats*/

    public void OnClick()
    {
        SceneManager.LoadScene("LevelSelection", LoadSceneMode.Single);
    }
}
