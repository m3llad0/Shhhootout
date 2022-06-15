using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class LoadEditor : MonoBehaviour
{
    public void OnClick()
    {
        SceneManager.LoadScene("Editor", LoadSceneMode.Single);
    }
}
