"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, Copy, RotateCcw, FileText, Send, Loader2 } from "lucide-react"

const EXAMPLE_JSONS = {
  "user-basic": {
    name: "Basic User Profile",
    section: "User Data",
    apiMethod: "POST" as const,
    apiUrl: "https://jsonplaceholder.typicode.com/users",
    data: {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      age: 30,
      isActive: true,
    },
  },
  "user-detailed": {
    name: "Detailed User Profile",
    section: "User Data",
    apiMethod: "PUT" as const,
    apiUrl: "https://jsonplaceholder.typicode.com/users/1",
    data: {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      age: 30,
      isActive: true,
      preferences: {
        theme: "dark",
        notifications: true,
      },
      tags: ["developer", "javascript", "react"],
    },
  },
  "product-simple": {
    name: "Simple Product",
    section: "E-commerce",
    apiMethod: "POST" as const,
    apiUrl: "https://jsonplaceholder.typicode.com/posts",
    data: {
      id: "prod-123",
      title: "Wireless Headphones",
      price: 199.99,
      inStock: true,
    },
  },
  "product-detailed": {
    name: "Product Catalog",
    section: "E-commerce",
    apiMethod: "PUT" as const,
    apiUrl: "https://jsonplaceholder.typicode.com/posts/1",
    data: {
      id: "prod-123",
      title: "Wireless Headphones",
      description: "High-quality wireless headphones with noise cancellation",
      price: 199.99,
      inStock: true,
      categories: ["electronics", "audio"],
      specifications: {
        battery: "30 hours",
        connectivity: "Bluetooth 5.0",
        weight: "250g",
      },
    },
  },
  "api-success": {
    name: "Success Response",
    section: "API Responses",
    apiMethod: "GET" as const,
    apiUrl: "https://jsonplaceholder.typicode.com/posts",
    data: {
      status: "success",
      data: {
        users: [
          {
            id: 1,
            username: "alice",
            role: "admin",
          },
          {
            id: 2,
            username: "bob",
            role: "user",
          },
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 25,
        },
      },
      timestamp: "2024-01-15T10:30:00Z",
    },
  },
  "api-error": {
    name: "Error Response",
    section: "API Responses",
    apiMethod: "GET" as const,
    apiUrl: "https://jsonplaceholder.typicode.com/posts/999",
    data: {
      status: "error",
      error: {
        code: 404,
        message: "Resource not found",
        details: "The requested post does not exist",
      },
      timestamp: "2024-01-15T10:30:00Z",
    },
  },
}

const API_EXAMPLES = {
  GET: {
    url: "https://jsonplaceholder.typicode.com/posts/1",
    description: "Fetch a single post (JSON will be sent as query params)",
  },
  POST: {
    url: "https://jsonplaceholder.typicode.com/posts",
    description: "Create a new post (JSON will be sent in request body)",
  },
  PUT: {
    url: "https://jsonplaceholder.typicode.com/posts/1",
    description: "Update an existing post (JSON will be sent in request body)",
  },
}

const highlightJson = (jsonString: string) => {
  return jsonString
    .replace(/"([^"]+)":/g, '<span class="text-blue-600 font-medium">"$1":</span>')
    .replace(/: "([^"]*)"/g, ': <span class="text-green-600">"$1"</span>')
    .replace(/: (\d+\.?\d*)/g, ': <span class="text-purple-600">$1</span>')
    .replace(/: (true|false)/g, ': <span class="text-orange-600">$1</span>')
    .replace(/: (null)/g, ': <span class="text-gray-500">$1</span>')
    .replace(/(\[|\]|\{|\})/g, '<span class="text-gray-700 font-bold">$1</span>')
    .replace(/,/g, '<span class="text-gray-500">,</span>')
}

export function JsonFormComponent() {
  const [jsonInput, setJsonInput] = useState("")
  const [parsedJson, setParsedJson] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(false)
  const [apiMethod, setApiMethod] = useState<"GET" | "POST" | "PUT">("POST")
  const [apiUrl, setApiUrl] = useState("")
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isExampleSelected, setIsExampleSelected] = useState(false)

  const validateAndParseJson = useCallback((input: string) => {
    if (!input.trim()) {
      setError(null)
      setParsedJson(null)
      setIsValid(false)
      return
    }

    try {
      const parsed = JSON.parse(input)
      setParsedJson(parsed)
      setError(null)
      setIsValid(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON format")
      setParsedJson(null)
      setIsValid(false)
    }
  }, [])

  const handleInputChange = (value: string) => {
    setJsonInput(value)
    validateAndParseJson(value)
  }

  const loadExample = (exampleKey: keyof typeof EXAMPLE_JSONS) => {
    const example = EXAMPLE_JSONS[exampleKey]
    const formattedJson = JSON.stringify(example.data, null, 2)
    setJsonInput(formattedJson)
    validateAndParseJson(formattedJson)
    setApiMethod(example.apiMethod)
    setApiUrl(example.apiUrl)
    setIsExampleSelected(true)
  }

  const formatJson = () => {
    if (parsedJson) {
      const formatted = JSON.stringify(parsedJson, null, 2)
      setJsonInput(formatted)
    }
  }

  const copyToClipboard = async () => {
    if (jsonInput) {
      await navigator.clipboard.writeText(jsonInput)
    }
  }

  const clearForm = () => {
    setJsonInput("")
    setParsedJson(null)
    setError(null)
    setIsValid(false)
    setApiUrl("")
    setApiResponse(null)
    setApiError(null)
    setIsExampleSelected(false)
  }

  const getJsonStats = () => {
    if (!parsedJson) return null

    const jsonString = JSON.stringify(parsedJson)
    const lines = jsonInput.split("\n").length
    const chars = jsonString.length
    const keys = JSON.stringify(parsedJson).match(/"[^"]*":/g)?.length || 0

    return { lines, chars, keys }
  }

  const stats = getJsonStats()

  const callApi = async () => {
    if (!apiUrl.trim()) {
      return
    }

    if (!isValid && apiMethod !== "GET") {
      return
    }

    setIsLoading(true)
    setApiError(null)
    setApiResponse(null)

    try {
      const requestOptions: RequestInit = {
        method: apiMethod,
        headers: {
          "Content-Type": "application/json",
        },
      }

      if (apiMethod === "GET" && parsedJson) {
        const params = new URLSearchParams()
        const flattenObject = (obj: any, prefix = "") => {
          Object.keys(obj).forEach((key) => {
            const value = obj[key]
            const newKey = prefix ? `${prefix}.${key}` : key
            if (typeof value === "object" && value !== null && !Array.isArray(value)) {
              flattenObject(value, newKey)
            } else {
              params.append(newKey, String(value))
            }
          })
        }
        if (parsedJson) flattenObject(parsedJson)
        const urlWithParams = `${apiUrl}${apiUrl.includes("?") ? "&" : "?"}${params.toString()}`
        const response = await fetch(urlWithParams, requestOptions)
        const data = await response.json()
        setApiResponse({ status: response.status, data })
      } else {
        if (parsedJson) {
          requestOptions.body = JSON.stringify(parsedJson)
        }
        const response = await fetch(apiUrl, requestOptions)
        const data = await response.json()
        setApiResponse({ status: response.status, data })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "API call failed"
      setApiError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const loadApiExample = () => {
    const example = API_EXAMPLES[apiMethod]
    setApiUrl(example.url)
  }

  const groupedExamples = Object.entries(EXAMPLE_JSONS).reduce(
    (acc, [key, example]) => {
      if (!acc[example.section]) {
        acc[example.section] = []
      }
      acc[example.section].push({ key, ...example })
      return acc
    },
    {} as Record<string, Array<{ key: string } & (typeof EXAMPLE_JSONS)[keyof typeof EXAMPLE_JSONS]>>,
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            JSON Form Builder
          </CardTitle>
          <CardDescription>Create, validate, and format JSON data with API testing capabilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="examples">Load Template:</Label>
              <Select onValueChange={(value) => loadExample(value as keyof typeof EXAMPLE_JSONS)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(groupedExamples).map(([section, examples], sectionIndex) => (
                    <div key={section}>
                      {sectionIndex > 0 && <div className="border-t my-1" />}
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {section}
                      </div>
                      {examples.map((example) => (
                        <SelectItem key={example.key} value={example.key}>
                          {example.name}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={formatJson} disabled={!isValid}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Format
              </Button>
              <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!jsonInput}>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={clearForm}>
                Clear
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="api-method">HTTP Method</Label>
              <Select
                value={apiMethod}
                onValueChange={(value: "GET" | "POST" | "PUT") => setApiMethod(value)}
                disabled={isExampleSelected}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="api-url">API URL</Label>
              <div className="flex gap-2">
                <Input
                  id="api-url"
                  placeholder="Enter API endpoint URL..."
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  disabled={isExampleSelected}
                />
                <Button variant="outline" onClick={loadApiExample} disabled={isExampleSelected}>
                  Example
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="json-input">JSON Input</Label>
                <div className="flex items-center gap-2">
                  {isValid ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Valid
                    </Badge>
                  ) : error ? (
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      Invalid
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Empty</Badge>
                  )}
                </div>
              </div>

              <div className="relative">
                <Textarea
                  id="json-input"
                  placeholder="Enter your JSON here..."
                  value={jsonInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="min-h-[400px] font-mono text-sm relative z-10 bg-transparent resize-none placeholder:text-black"
                  style={{ color: "transparent", caretColor: "black" }}
                />
                <div
                  className="absolute inset-0 p-3 font-mono text-sm pointer-events-none overflow-auto whitespace-pre-wrap break-words"
                  style={{
                    paddingTop: "12px",
                    paddingLeft: "12px",
                    paddingRight: "12px",
                    paddingBottom: "12px",
                    lineHeight: "1.5",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: jsonInput ? highlightJson(jsonInput) : "",
                  }}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {stats && (
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{stats.lines} lines</span>
                  <span>{stats.chars} characters</span>
                  <span>{stats.keys} keys</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <Label>JSON Preview</Label>
              {parsedJson ? (
                <div className="bg-muted rounded-lg p-4">
                  <pre className="text-sm overflow-auto max-h-[400px]">
                    <code
                      dangerouslySetInnerHTML={{
                        __html: highlightJson(JSON.stringify(parsedJson, null, 2)),
                      }}
                    />
                  </pre>
                </div>
              ) : (
                <div className="bg-muted rounded-lg p-4 min-h-[400px] flex items-center justify-center">
                  <p className="text-muted-foreground text-center">
                    {error ? "Fix JSON errors to see preview" : "Enter valid JSON to see preview"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm text-muted-foreground">
              <strong>{apiMethod}:</strong> {API_EXAMPLES[apiMethod].description}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={callApi}
              disabled={isLoading || !apiUrl.trim() || (apiMethod !== "GET" && !isValid)}
              className="flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {isLoading ? "Calling..." : `Call ${apiMethod} API`}
            </Button>
          </div>

          {apiError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          {apiResponse && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label>API Response</Label>
                <Badge variant={apiResponse.status < 400 ? "default" : "destructive"}>
                  Status: {apiResponse.status}
                </Badge>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <pre className="text-sm overflow-auto max-h-[300px]">
                  <code
                    dangerouslySetInnerHTML={{
                      __html: highlightJson(JSON.stringify(apiResponse.data, null, 2)),
                    }}
                  />
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
