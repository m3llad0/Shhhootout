using System.Collections;
using System.Collections.Generic;
using UnityEngine;
/*

Diego Mellado Oliveros
Electronic Rats
Player movement and aiming with mouse
https://www.youtube.com/watch?v=LNLVOjbrQj4&ab_channel=Brackeys
*/
public class PlayerMovement : MonoBehaviour
{
    public float moveSpeed = 5f;
    public Rigidbody2D rb;
    private Camera cam;
    Vector2 movement;
    Vector2 mousePos;

    void Start()
    {
        cam = Camera.main;
        Timer.instantiate.startTime();
    }
    void Update()
    {
        movement.x = Input.GetAxisRaw("Horizontal");
        movement.y = Input.GetAxisRaw("Vertical");

        mousePos = cam.ScreenToWorldPoint(Input.mousePosition);
    }

    private void FixedUpdate()
    {
        rb.MovePosition(rb.position + movement * moveSpeed * Time.fixedDeltaTime);

        Vector2 lookDir = mousePos - rb.position;
        float angle = Mathf.Atan2(lookDir.y ,lookDir.x) * Mathf.Rad2Deg + 90f;
        rb.rotation = angle;
    }
}