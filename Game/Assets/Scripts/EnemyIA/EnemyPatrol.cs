using System.Collections;
using System.Collections.Generic;
using UnityEngine;
/*
Enemy Patrol
Diego Mellado
Electronic Rats
*/
public class EnemyPatrol : MonoBehaviour
{
    public float speed;
    private float waitTime;
    public float startWaitTime;

    public Rigidbody2D rb2d;

    public Transform[] moveSpot;
    private int randomSpot;


    void Start()
    {
        waitTime = startWaitTime;
        randomSpot = Random.Range(0, moveSpot.Length);
    }

    void Update()
    {
        transform.position = Vector2.MoveTowards(transform.position, moveSpot[randomSpot].position, speed * Time.deltaTime);
        
        Vector2 lookDir = moveSpot[randomSpot].position - transform.position;

        float angle = Mathf.Atan2(lookDir.y, lookDir.x) * Mathf.Rad2Deg - 90f;

        rb2d.rotation = angle;

        if(Vector2.Distance(transform.position, moveSpot[randomSpot].position) < 0.2f)
        {
            if(waitTime <= 0)
            {
                randomSpot = Random.Range(0, moveSpot.Length);
            }else
            {
                waitTime -= Time.deltaTime;
            }
        }
    }
}

