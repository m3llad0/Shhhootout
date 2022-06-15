using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ItemManager : MonoBehaviour
{
    public int _id; 
    public int quantity;
    public bool clicked = false;
    private LevelManager editor;
    TileEditor _editor;
    void Start()
    {
        editor = GameObject.FindGameObjectWithTag("LevelEditorManager").GetComponent<LevelManager>();
    }
    public void ButtonClicked()
    {
       
        if(quantity > 0)
        {
            Vector2 screenPosition = new Vector2(Input.mousePosition.x, Input.mousePosition.y);
            Vector2 worldPosition = Camera.main.ScreenToWorldPoint(screenPosition);
            var instanced = Instantiate(editor.itemPreview[_id], new Vector3(worldPosition.x, worldPosition.y, 0), Quaternion.identity);

            clicked = true;
            quantity --;
            editor.currentButton = _id;

        }

        if(GameObject.FindGameObjectWithTag("Room") != null)
        {
            GameObject room = GameObject.FindGameObjectWithTag("Room");
            _editor = room.GetComponent<TileEditor>();

            _editor.currenTile = null;
        }

        
    }
}
