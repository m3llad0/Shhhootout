using System.Collections;
using System.Collections.Generic;
using UnityEngine;
/*
Enemy shooting
Diego Mellado Oliveros
Electronic Rats

*/
public class EnemyShooting : MonoBehaviour
{
    public GameObject bulletPrefab;
    public Transform firePoint;
    public float bulletForce = 20f;
    public float fireRate;
    private float nextFire;

    private FieldOfView _fieldofview;


    void Start()
    {
        nextFire = Time.time;    
        _fieldofview = GetComponent<FieldOfView>();
    }

    void Update()
    {       
    
        if(_fieldofview.canSeePlayer)
        {
            CheckTimeToFire();
        } 
    }  

    void CheckTimeToFire()
    {
        if(Time.time > nextFire)
        {
            //Instantiate(bullet, transform.position, Qu)
            Shoot();
            nextFire = Time.time + fireRate;
        }
    }

    void Shoot()
    {
        GameObject bullet = Instantiate(bulletPrefab, firePoint.position, firePoint.rotation);
        Rigidbody2D rb2d = bullet.GetComponent<Rigidbody2D>();

        rb2d.AddForce(firePoint.up * bulletForce, ForceMode2D.Impulse);
    }
}
