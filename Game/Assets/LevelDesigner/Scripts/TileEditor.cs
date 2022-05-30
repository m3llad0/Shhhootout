using System.Collections;
using System.Collections.Generic;
using UnityEngine.Tilemaps;
using System.Linq;
using UnityEngine;

public class TileEditor : MonoBehaviour
{
    [SerializeField]
     Tilemap currentTilemap;
    public TileBase currenTile;

    [SerializeField] 
    Camera cam;

    void Start()
    {
        cam = Camera.main;
    }
    void PlaceTile(Vector3Int position)
    {
        currentTilemap.SetTile(position, currenTile);
    }

    void DeleteTile(Vector3Int position)
    {
        currentTilemap.SetTile(position, null);
    }

    void Update()
    {
        Vector3Int pos = currentTilemap.WorldToCell(cam.ScreenToWorldPoint(Input.mousePosition));

        if(Input.GetMouseButtonDown(0))
        {
            PlaceTile(pos);
        }
        if(Input.GetMouseButtonDown(1))
        {
            DeleteTile(pos);
        }
    }
}
