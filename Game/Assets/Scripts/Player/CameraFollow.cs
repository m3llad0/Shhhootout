using System.Collections;
using System.Collections.Generic;
using UnityEngine;
/*
    Camera Follow
    Electronic Rats

*/
public class CameraFollow : MonoBehaviour
{
    [SerializeField] private Transform target;
 
   	public float yOffset = 0.0f;
	public float xOffset = 0.0f;

	
	void Awake()
	{
		GameObject player = GameObject.FindGameObjectWithTag("Player");

		if (player != null) {
			target = player.GetComponent<Transform>();
		} else {

			MapManager.OnLoad += () => {  
				target = GameObject.FindGameObjectWithTag("Player").GetComponent<Transform>(); 
			};

		}

	}
	void LateUpdate () 
    {
		if(target != null)
        {
			Vector3 position = target.position;
			position.x += xOffset;
			position.y += yOffset;
			position.z = transform.position.z;
			transform.position = position;
		}
	}
}