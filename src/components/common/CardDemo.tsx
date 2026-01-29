import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card'
import Button from './Button'

const CardDemo: React.FC = () => {
  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Card Component Demo</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Default Card</h2>
          <Card>
            <CardHeader>
              <CardTitle>Default Card Title</CardTitle>
              <CardDescription>
                This is a description of the card content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-surface-subtitle">
                This is the main content area of the card. You can put any
                content here.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="primary">Action</Button>
            </CardFooter>
          </Card>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Card with Separators</h2>
          <Card>
            <CardHeader withSeparator>
              <CardTitle>Card with Header Separator</CardTitle>
              <CardDescription>Header has a bottom border</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-surface-subtitle">
                Content goes here. Notice the separator line above this content.
              </p>
            </CardContent>
            <CardFooter withSeparator>
              <div className="flex justify-between w-full">
                <Button variant="ghost">Cancel</Button>
                <Button variant="primary">Confirm</Button>
              </div>
            </CardFooter>
          </Card>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Card Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Default</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Standard card with background and border
                </p>
              </CardContent>
            </Card>

            <Card variant="outline">
              <CardHeader>
                <CardTitle>Outline</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Transparent background with border</p>
              </CardContent>
            </Card>

            <Card variant="ghost">
              <CardHeader>
                <CardTitle>Ghost</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">No background, no border, no shadow</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Card Sizes</h2>
          <div className="space-y-4">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Small Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Compact padding (p-3)</p>
              </CardContent>
            </Card>

            <Card size="md">
              <CardHeader>
                <CardTitle>Medium Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Default padding (p-6)</p>
              </CardContent>
            </Card>

            <Card size="lg">
              <CardHeader>
                <CardTitle>Large Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Large padding (p-8)</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Card Title Levels</h2>
          <Card>
            <CardHeader>
              <CardTitle as="h1">H1 Title</CardTitle>
              <CardDescription>Using as="h1" prop</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <CardTitle as="h2">H2 Subtitle</CardTitle>
                <p className="text-sm">Section within card content</p>
              </div>
              <div>
                <CardTitle as="h3">H3 Subtitle</CardTitle>
                <p className="text-sm">Another section</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default CardDemo
