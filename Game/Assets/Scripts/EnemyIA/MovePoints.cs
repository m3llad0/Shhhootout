using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MovePoints : MonoBehaviour
{
    Vector2 difference = Vector2.zero;
    void OnMouseDown()
    {
        Debug.Log("Coito");
        difference = (Vector2)Camera.main.ScreenToWorldPoint(Input.mousePosition) - (Vector2)transform.position;
    }

    void OnMouseDrag()
    {
        Debug.Log("Siuuu");
        transform.position = (Vector2)Camera.main.ScreenToWorldPoint(Input.mousePosition) - difference;
    }
}
