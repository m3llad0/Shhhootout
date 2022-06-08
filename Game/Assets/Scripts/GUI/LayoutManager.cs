using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using UnityEngine;

public class LayoutManager : MonoBehaviour
{
    GameObject menu;
    Text message;
    Text score;
    PlayerHealth _health;
    PlayerScore _score;
    EndTimer _time;

    /// <summary>
    /// Start is called on the frame when a script is enabled just before
    /// any of the Update methods is called the first time.
    /// </summary>
    void Start()
    {
        menu = GameObject.FindGameObjectWithTag("GameOverlay");
        message = GameObject.FindGameObjectWithTag("Message").GetComponent<Text>();
        score = GameObject.FindGameObjectWithTag("Score").GetComponent<Text>();
        _score = GameObject.FindGameObjectWithTag("Player").GetComponent<PlayerScore>();
        _health = GameObject.FindGameObjectWithTag("Player").GetComponent<PlayerHealth>();
        _time = GameObject.FindGameObjectWithTag("Player").GetComponent<EndTimer>();
    }

    void Update()
    {
        if(_health.playerHealth == 0)
        {
            string message = "Game over";
            string score = _score.ToString();

            setOverlay(score, message);
            
        }else if(_time.end)
        {
            string message = "Mission Completed";
            string score = _score.ToString();

            setOverlay(score, message);
        }
    }

    void setOverlay(string score_, string message_)
    {
        menu.SetActive(true);
        message.text = message_;
        score.text = score_;
    }


}
