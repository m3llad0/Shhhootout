using System.Collections;
using System.Collections.Generic;
using UnityEngine.Tilemaps;
using UnityEngine;

public class SelectCrate : MonoBehaviour
{
  [SerializeField] 
    TileBase Crate;
    TileEditor _editor;

    public void OnClickButton()
    {
        GameObject room = GameObject.FindGameObjectWithTag("Room");
        _editor = room.GetComponent<TileEditor>();

        _editor.currenTile = Crate;
    }  
}
