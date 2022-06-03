using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using UnityEngine;

public class UIManager : MonoBehaviour
{
    public GameObject gameOverlay;
    private Text score;
    private Text message;
    GameObject player;

    /// <summary>
    /// Start is called on the frame when a script is enabled just before
    /// any of the Update methods is called the first time.
    /// </summary>
    void Start()
    {
        // score = gameOverlay.GetComponentInChildren<
    }
    public void EnableGameOverlay()
    {
        gameOverlay.SetActive(true);
    }   


}
