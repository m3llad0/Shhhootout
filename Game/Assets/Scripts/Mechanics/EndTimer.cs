using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EndTimer : MonoBehaviour
{

    void OnCollisionEnter2D(Collision2D collision)
    {
        if(collision.gameObject.tag == "Door")
        {
            Timer.instantiate.endTime();
            
        }
    }
}
