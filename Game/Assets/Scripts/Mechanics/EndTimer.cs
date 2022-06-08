using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EndTimer : MonoBehaviour
{
    public bool end = false;

    void OnCollisionEnter2D(Collision2D collision)
    {
        if(collision.gameObject.tag == "Final Door")
        {
            Timer.instantiate.endTime();
            Debug.Log("You won");
            end = true;
            
        }
    }
}
