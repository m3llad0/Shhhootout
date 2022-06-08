using System.Collections;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using UnityEngine;

public class LoadTutorial : MonoBehaviour
{
   public void OnClick()
   {
       SceneManager.LoadScene("Shhhtout", LoadSceneMode.Single);
   }
}
