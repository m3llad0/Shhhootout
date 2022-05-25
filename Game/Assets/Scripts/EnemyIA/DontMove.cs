using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DontMove : MonoBehaviour
{
 public Transform[] children;
 
 private void Awake () {
     // Sets each child's parent to null while keeping their world position.
     foreach (Transform child in children) {
         child.SetParent(null, true);
     }
 }
}
