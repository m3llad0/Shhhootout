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
    public Text chrono;
    private TimeSpan timeChrono;
    private bool timerBool;
    private float time;
    
    void Awake()
    {
        instantiate = this; //nutz
    }

    void Start()
    {
        chrono.text = "00:00:00";
        timerBool = false;
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
            timeChrono = TimeSpan.FromSeconds(time);
            string timeStr = timeChrono.ToString("mm':'ss':'ff");
            chrono.text = timeStr;

            yield return null;
        }
    }

}
