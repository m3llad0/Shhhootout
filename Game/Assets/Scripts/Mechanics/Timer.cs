using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using System;
using UnityEngine;
/*
Chrono script
Diego Mellado Oliveros
Electronic Rats 
*/
public class Timer : MonoBehaviour
{
    public static Timer instantiate;
    private Text chrono;
    private TimeSpan timeChrono;
    private bool timerBool;
    private float time;
    private string timeStr;
    
    void Awake()
    {
        instantiate = this; //nutz
        chrono = GameObject.FindGameObjectWithTag("Timer").GetComponent<Text>();

    }

    public float Time_
    {
        get{ return time;

        }
    }
    void Start()
    {
        chrono.text = "00:00:00";
        // timerBool = false;
    }

    public void startTime()
    {
        timerBool = true;
        time = 0f;

        StartCoroutine(TimeUpdate());
    }

    public void endTime()
    {
        timerBool = false;

    }

    private IEnumerator TimeUpdate()
    {
        while(timerBool)
        {
            time += Time.deltaTime;
            Debug.Log(time);
            timeChrono = TimeSpan.FromSeconds(time);
            timeStr = timeChrono.ToString("mm':'ss':'ff");
            chrono.text = timeStr;

            yield return null;
        }
    }

}
