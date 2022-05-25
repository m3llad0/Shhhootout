using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
/*
Enemy field of view
Diego Mellado Oliveros 
Electronic Rats
https://www.youtube.com/watch?v=OQ1dRX5NyM0&ab_channel=Comp-3Interactive

*/
public class FieldOfView : MonoBehaviour
{
    public float radius;
    [Range(1, 360)] public float angle;
    public LayerMask targetLayer;
    public LayerMask obstructionLayer;
    public GameObject player;
    public bool canSeePlayer {get; private set;}


    void Start()
    {
        player = GameObject.FindGameObjectWithTag("Player");

        if(player)
        {
            Debug.Log("Player found");
        }

        StartCoroutine(FOVCheck());
    }

    IEnumerator FOVCheck()
    {
       WaitForSeconds wait = new WaitForSeconds(0.2f);

       while(true)
       {
           yield return wait;
           FOV();
       }
    }
    void Hearing()
    {
        Collider2D [] hearingRange = Physics2D.OverlapCircleAll(transform.position, radius, targetLayer);
        
    }
    void FOV()
    {
        Collider2D [] rangeCheck = Physics2D.OverlapCircleAll(transform.position, radius, targetLayer);

        if(rangeCheck.Length > 0)
        {
            Transform target = rangeCheck[0].transform; 
            Vector2 directionTarget = (target.position - transform.position).normalized; 

            if(Vector2.Angle(transform.up, directionTarget) < angle/2)
            {
                float distanceTarget = Vector2.Distance(transform.position, target.position);

                if(!Physics2D.Raycast(transform.position, directionTarget, distanceTarget, obstructionLayer))
                {
                    canSeePlayer = true;
                }
                else
                {
                    canSeePlayer = false;
                }
            }
            else 
            {
                canSeePlayer = false;
            }
        }
        else if (canSeePlayer)
        {
            canSeePlayer = false;
        }
    }

    
    private void OnDrawGizmos()
    {
        Gizmos.color = Color.white;
        UnityEditor.Handles.DrawWireDisc(transform.position, Vector3.forward, radius);

        Vector3 angle1 = DirectionFromAngle(-transform.eulerAngles.z, -angle/2);
        Vector3 angle2 = DirectionFromAngle(-transform.eulerAngles.z, angle/2);

        Gizmos.color = Color.yellow;
        Gizmos.DrawLine(transform.position, transform.position + angle1 * radius);
        Gizmos.DrawLine(transform.position, transform.position + angle2 * radius);

        if(canSeePlayer)
        {
            Gizmos.color = Color.green;
            Gizmos.DrawLine(transform.position, player.transform.position);
        }

    }

    private Vector3 DirectionFromAngle(float eulerY, float angleDegrees)
    {
        angleDegrees += eulerY;
        return new Vector2(Mathf.Sin(angleDegrees * Mathf.Deg2Rad), Mathf.Cos(angleDegrees * Mathf.Deg2Rad));
    }
}
