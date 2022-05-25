using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyHealth : MonoBehaviour
{
    public int enemyHealth = 100;

    public Bullet _bullet;

    /// <summary>
    /// Start is called on the frame when a script is enabled just before
    /// any of the Update methods is called the first time.
    /// </summary>
    void Start()
    {
        _bullet = FindObjectOfType<Bullet>();
    }

    /// <summary>
    /// Sent when an incoming collider makes contact with this object's
    /// collider (2D physics only).
    /// </summary>
    /// <param name="other">The Collision2D data associated with this collision.</param>
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
