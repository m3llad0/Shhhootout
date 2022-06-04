using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Tilemaps;

[CreateAssetMenu(fileName = "New Level Tile", menuName = "2D/Tiles/Level Tile")]
public class LevelTile : Tile
{
    public TileType Type;
}

public enum TileType
{
    // Floor
    Dirt = 0,
    Sand = 1,
    Asphalt = 2,
    
    // Objects
    Crate = 1001,
    SandBag = 1002,
    Tank = 1003
    
}
