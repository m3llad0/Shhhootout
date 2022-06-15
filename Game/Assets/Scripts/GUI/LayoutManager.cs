using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using System;
using UnityEngine;

public class LayoutManager : MonoBehaviour
{
    public GameObject menu;
    public Text message;
    public Text score;
    private PlayerHealth _health;
    private PlayerScore _score;
    private EndTimer _endtime;
    private Timer _time;

    private bool started = false;

    bool stored = false;

    void Awake()
    {
        MapManager.OnLoad += Init;
    }
    void Start()
    {
        if (GameObject.FindGameObjectWithTag("Player") == null) return;
        Init();
    }

    void Init()
    {
        _health = GameObject.FindGameObjectWithTag("Player").GetComponent<PlayerHealth>();
        _score = GameObject.FindGameObjectWithTag("Player").GetComponent<PlayerScore>();
        _time = GameObject.FindGameObjectWithTag("Player").GetComponent<Timer>();
        _endtime = GameObject.FindGameObjectWithTag("Player").GetComponent<EndTimer>();

        started = true;
    }
    void Update()
    {
        if (!started) return;

        if (_health.playerHealth == 0)
        {
            string message = "Game over";
            string score = _score.playerScore.ToString();
            Debug.Log(score);

              var request = new APIConnection.CreateScoreRequest();
                request.completed = false;
                request.session_id = SessionManager.Instance.GetSession();
                if ( LevelLoader.Instance != null) { 
                    request.level_id = LevelLoader.Instance.CurrentLevel;
                }
                request.time = _time.Time_;

                if(stored == false)
               { 
                StartCoroutine(APIConnection.CreateScore(request, result => {
                    Debug.Log("Score Created!!!");}));
                    stored = true;
                }
                
            setOverlay(score, message);

        }
        else if (_endtime.end)
        {
            string message = "Mission Completed";

            float time = (_time.Time_);

            Debug.Log(time);

            if (time < 60.0)
            {
                double finalScore =  (2.5 * (_score.playerScore + 500));
                string score = finalScore.ToString();
                
                var request = new APIConnection.CreateScoreRequest();
                request.completed = true;
                request.session_id = SessionManager.Instance.GetSession();
                if (LevelLoader.Instance != null ) {
                     request.level_id = LevelLoader.Instance.CurrentLevel;
                }
               
                request.time = finalScore;

                if(stored == false)
               { 
                StartCoroutine(APIConnection.CreateScore(request, result => {
                    Debug.Log("Score Created!!!");}));
                    stored = true;
                }

                setOverlay(score, message);

            }
            else if (time < 90.0)
            {
                double finalScore = (1.5 * (_score.playerScore + 250));

                string score = finalScore.ToString();
                
                var request = new APIConnection.CreateScoreRequest();
                request.completed = true;
                request.session_id = SessionManager.Instance.GetSession();
                if (LevelLoader.Instance != null ) {
                     request.level_id = LevelLoader.Instance.CurrentLevel;
                }
               
                request.time = finalScore;

                if(stored == false)
               { 
                StartCoroutine(APIConnection.CreateScore(request, result => {
                    Debug.Log("Score Created!!!");}));
                    stored = true;
                }

                setOverlay(score, message);

            }
            else
            {
                double finalScore = (0.5 * (_score.playerScore + 100));

                string score = finalScore.ToString();
                
                var request = new APIConnection.CreateScoreRequest();
                request.completed = true;
                request.session_id = SessionManager.Instance.GetSession();
                if (LevelLoader.Instance != null ) {
                     request.level_id = LevelLoader.Instance.CurrentLevel;
                }
               
                request.time = finalScore;

                if(stored == false)
               { 
                StartCoroutine(APIConnection.CreateScore(request, result => {
                    Debug.Log("Score Created!!!");}));
                    stored = true;
                }

                setOverlay(score, message);

            }
        }
    }

    void setOverlay(string score_, string message_)
    {
        menu.SetActive(true);
        message.text = message_;
        score.text = score_;
    }


}
