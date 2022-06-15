using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnableSave : MonoBehaviour
{
    public GameObject overLay;

    TileEditor _editor;

    public void OnClick()
    {
        overLay.SetActive(true);

        GameObject room = GameObject.FindGameObjectWithTag("Room");
        _editor = room.GetComponent<TileEditor>();

        _editor.currenTile = null;
    }
}
