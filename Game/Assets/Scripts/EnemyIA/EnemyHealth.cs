using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyHealth : MonoBehaviour
{
    public int enemyHealth = 100;

    public Bullet _bullet;


    void Start()
    {
        _bullet = FindObjectOfType<Bullet>();
    }

    void OnCollisionEnter2D(Collision2D collision)
    {
        Debug.Log("Hit!");
        if(collision.gameObject.tag == "Bullet")
        {
            enemyHealth -= 20;

            Debug.Log(enemyHealth);

            if(enemyHealth <= 0)
            {
                gameObject.SetActive(false);
                Debug.Log("Dead!");
            }
        }
    }
}
