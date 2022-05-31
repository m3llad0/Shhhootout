using System.Collections;
using System.Collections.Generic;
using UnityEngine.Tilemaps;
using UnityEngine;

public class SelectSandBag : MonoBehaviour
{
  [SerializeField] 
    TileBase SandBag;
    TileEditor _editor;

    public void OnClickButton()
    {
        GameObject room = GameObject.FindGameObjectWithTag("Room");
        _editor = room.GetComponent<TileEditor>();

        _editor.currenTile = SandBag;
    }
}
