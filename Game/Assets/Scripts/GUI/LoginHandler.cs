using TMPro;
using UnityEngine;

public class LoginHandler : MonoBehaviour
{
    public GameObject accountField;
    public GameObject passwordField;
    
    public GameObject errorBanner;
    struct FormData
    {
        public string label;
        public string value;
    }
    
    public void OnSubmit()
    {
        FormData account = ReadFormField(accountField);
        FormData password = ReadFormField(passwordField);

        StartCoroutine(APIConnection.Login(account.value, password.value, result =>
        {
            if (!result.ok)
            {
                errorBanner.SetActive(true);
                GameObject value = errorBanner.transform.Find("Value").gameObject;
                value.GetComponent<TextMeshProUGUI>().text = result.error.message;
                return;
            }

            SessionManager.Instance.SetToken(result.data.token);
        }));
    }

    private FormData ReadFormField(GameObject field)
    {
        FormData result = new FormData();
        
        GameObject label = field.transform.Find("Label").gameObject;
        GameObject value = field.transform.Find("Value").gameObject;
        
        result.label = label.GetComponent<TextMeshProUGUI>().text;
        
        // Could extend to support more types
        result.value = value.GetComponent<TMP_InputField>().text;
        return result;
    }
    
}
