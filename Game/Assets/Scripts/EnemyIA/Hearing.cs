using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Hearing : MonoBehaviour
{
    public bool canHearPlayer;
    void OnTriggerEnter2D(Collider2D collision)
    {
        if(collision.tag == "Bullet")
        {
            canHearPlayer = true;
            Debug.Log("wtf is that?");

        }
    }
}
