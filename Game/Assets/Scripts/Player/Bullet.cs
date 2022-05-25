using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Bullet : MonoBehaviour
{
    public int damage;

    void Start()
    {
        damage = 20;        
    }
    
    void OnCollisionEnter2D(Collision2D collision)
    {
        Destroy(gameObject);
       Debug.Log("Collison!");
    }
}
