using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using UnityEngine;

public class PlayerScore : MonoBehaviour
{
    public int playerScore = 0;
    public Text score; 


    /// <summary>
    /// Start is called on the frame when a script is enabled just before
    /// any of the Update methods is called the first time.
    /// </summary>
    void Start()
    {
        score.text = "Score: " + playerScore.ToString(); 
    }

    public void UpdateScore(int _score)
    {
        playerScore += _score;
        score.text = "Score: " + playerScore.ToString();
    }



}
