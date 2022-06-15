using System.Collections;
using System.Collections.Generic;
using UnityEngine.UI;
using UnityEngine;
/*
Diego Mellado Oliveros
Electronics Rats
Player Shooting
https://www.youtube.com/watch?v=LNLVOjbrQj4&ab_channel=Brackeys
*/
public class Shooting : MonoBehaviour
{
    public static AudioClip gunshotSound;
    public Transform firePoint;
    public GameObject bulletPrefab;
    public float bulletForce = 20f;
    public int ammo = 200;

    AudioSource SFX;

    Text _ammo;

    /// <summary>
    /// Start is called on the frame when a script is enabled just before
    /// any of the Update methods is called the first time.
    /// </summary>
    void Start()
    {
        gunshotSound = Resources.Load<AudioClip>("Sounds/SoundsFx/SilencedShot");
        _ammo = GameObject.FindGameObjectWithTag("Ammo").GetComponent<Text>();
        _ammo.text = ammo.ToString();
        SFX = GameObject.FindGameObjectWithTag("SFX").GetComponent<AudioSource>();
    }
    void Update()
    {
        if(Input.GetMouseButtonDown(0))
        {
            if(ammo > 0)
            {
                Shoot();
               
            }
        }
    }

    void Shoot()
    {
        GameObject bullet = Instantiate(bulletPrefab, firePoint.position, firePoint.rotation);
        Rigidbody2D rb2d = bullet.GetComponent<Rigidbody2D>();
        ammo -= 1;
        _ammo.text = ammo.ToString();
        SFX.PlayOneShot(gunshotSound);
        rb2d.AddForce(firePoint.up * bulletForce, ForceMode2D.Impulse);
        
    }
}
