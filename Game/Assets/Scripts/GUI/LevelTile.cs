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
    Wood = 0,

    // Wall
    CornerWallA = 1001,
    CornerWallB = 1002,
    CornerWallC = 1003,
    CornerWallD = 1004,
    
    // Objects
    Crate = 2001,
    SandBag = 2002,
    Tank = 2003,
    

    // Door
    DoorA = 3001,
    DoorB = 3002
}
