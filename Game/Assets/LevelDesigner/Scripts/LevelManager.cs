using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LevelManager : MonoBehaviour
{
    public ItemManager [] itemButton;
    public GameObject [] itemPrefabs;
    public GameObject [] itemPreview;
    public int currentButton;

    void Update()
    {
        Vector2 screenPosition = new Vector2(Input.mousePosition.x, Input.mousePosition.y);
        Vector2 worldPosition = Camera.main.ScreenToWorldPoint(screenPosition);

        if(Input.GetMouseButtonDown(0) && itemButton[currentButton].clicked)
        {
            itemButton[currentButton].clicked = false;
            Instantiate(itemPrefabs[currentButton], new Vector3(worldPosition.x, worldPosition.y, 0), Quaternion.identity);

            if(itemPrefabs[currentButton].tag != "Room")
            {
                MonoBehaviour [] scripts = itemPrefabs[currentButton].GetComponents<MonoBehaviour>();
                foreach (MonoBehaviour script in scripts)
                {
                    Debug.Log("Script disabled");
                    script.enabled = false;
                }
}

            Destroy(GameObject.FindGameObjectWithTag("ItemPreview"));
        }
    }

}
