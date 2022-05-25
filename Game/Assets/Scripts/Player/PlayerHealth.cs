using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerHealth : MonoBehaviour
{
    public int playerHealth = 100;

    public Bullet _bullet;

    void Start()
    {
        _bullet = FindObjectOfType<Bullet>();
    }

    void OnCollisionEnter2D(Collision2D collision)
    {
        if(collision.gameObject.tag == "Bullet Enemy")
        {
            playerHealth -= 10;
            Debug.Log("Hurt! Player health: " + playerHealth);

            if(playerHealth <= 0)
            {
                gameObject.SetActive(false);
                Debug.Log("Game Over");
            }
        }
    }

}
