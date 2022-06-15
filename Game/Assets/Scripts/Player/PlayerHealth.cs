using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using UnityEngine;

public class PlayerHealth : MonoBehaviour
{
    public int playerHealth = 100;

    public Bullet _bullet;
    Text _health;
    void Start()
    {
        _bullet = FindObjectOfType<Bullet>();
        _health = GameObject.FindGameObjectWithTag("Health").GetComponent<Text>();
    }

    void OnCollisionEnter2D(Collision2D collision)
    {
        if(collision.gameObject.tag == "Bullet Enemy")
        {
            playerHealth -= 10;
            _health.text = playerHealth.ToString();
            Debug.Log("Hurt! Player health: " + playerHealth);

            if(playerHealth <= 0)
            {
                gameObject.SetActive(false);
                Debug.Log("Game Over");
            }
        }
    }

}
