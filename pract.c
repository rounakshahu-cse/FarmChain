#include <stdio.h>
void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);

    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    swap(&arr[i + 1], &arr[high]);
    return (i + 1);
}

int quicksort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        
        
        quicksort(arr, low, pi - 1);
        quicksort(arr, pi + 1, high);
    }
    return arr;
}
typedef struct Node {
    int data;
    struct Node* left;
    struct Node* right;
} Node;

Node* createNode(int value) {
    Node* newNode = (Node*)malloc(sizeof(Node));
    if (newNode == NULL) {
        printf("Memory allocation failed!\n");
        exit(1);
    }
    newNode->data = value;
    newNode->left = NULL;
    newNode->right = NULL;
    return newNode;
}
int findmintwoterm(int a[])

{
    int i=0, low=0;
    int high=length(a[50]);
    quicksort(a[50],high,low);
    for( i=0; i< 6; i++)
    {
        printf("%d",a[i]);
    }
    return a;
}

int main()
{
    char letter[20] = {"A", "B", "C", "D", "E", "F"};
    int freq[50] = {5, 9, 12, 13, 16, 45};
    findmintwoterm(freq[50]);

    return 0;
}