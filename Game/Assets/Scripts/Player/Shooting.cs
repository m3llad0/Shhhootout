using System.Collections;
using System.Collections.Generic;
using UnityEngine;
/*
Diego Mellado Oliveros
Electronics Rats
Player Shooting
https://www.youtube.com/watch?v=LNLVOjbrQj4&ab_channel=Brackeys
*/
public class Shooting : MonoBehaviour
{
    public Transform firePoint;
    public GameObject bulletPrefab;
    public float bulletForce = 20f;

    // Update is called once per frame
    void Update()
    {
        if(Input.GetMouseButtonDown(0))
        {
            Shoot();
        }
    }

    void Shoot()
    {
        GameObject bullet = Instantiate(bulletPrefab, firePoint.position, firePoint.rotation);
        Rigidbody2D rb2d = bullet.GetComponent<Rigidbody2D>();
        
        rb2d.AddForce(firePoint.up * bulletForce, ForceMode2D.Impulse);
        
    }
}
