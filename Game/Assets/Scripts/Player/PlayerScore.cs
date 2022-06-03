using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using UnityEngine;

public class PlayerScore : MonoBehaviour
{
    public int playerScore = 0;
    private Text score; 

    void Awake()
    {
        score = GameObject.FindGameObjectWithTag("Score").GetComponent<Text>();
        Debug.Log("Find score");
    }
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
