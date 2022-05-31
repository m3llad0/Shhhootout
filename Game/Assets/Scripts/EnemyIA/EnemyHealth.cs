using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyHealth : MonoBehaviour
{
    public int enemyHealth = 100;

    public Bullet _bullet;
    public PlayerScore _score;


    void Start()
    {
        _bullet = FindObjectOfType<Bullet>();
        _score = FindObjectOfType<PlayerScore>();
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
                _score.UpdateScore(100);
                Debug.Log("Dead!");
            }
        }
    }
}
