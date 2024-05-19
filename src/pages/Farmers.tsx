import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { Schema } from "../../amplify/data/resource.ts";
import { generateClient } from "aws-amplify/api";
import { Card, Stack, Image, CardBody, Heading, Text, CardFooter, Button, Box } from '@chakra-ui/react';

const client = generateClient<Schema>();

const Farmers: React.FC = () => {
    const [profiles, setProfiles] = useState<Schema["Producer"]["type"][]>([]);
    const [nextToken, setNextToken] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const fetchProfiles = async () => {
        try {
            const limit = 12;
            const { data: items, errors, nextToken: newNextToken } = await client.models.Producer.list({ limit, nextToken });
            if (!errors) {
                setProfiles(items);
                setNextToken(newNextToken || null);
            } else {
                setError("Error fetching profiles");
            }
        } catch (error) {
            console.error('Error fetching profiles:', error);
            setError("Error fetching profiles");
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, [currentPage]);

    const handleNextPage = () => {
        if (nextToken) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const sortByName = () => {
        const sortedProfiles = [...profiles].sort((a, b) => {
            const nameA = a.farm_name ?? '';
            const nameB = b.farm_name ?? '';
            if (sortOrder === 'asc') {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });
        setProfiles(sortedProfiles);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    
    return (
        <>
            <NavBar />
            <div style={{ fontSize: '20px', textAlign: 'center', marginTop: '20px',  marginBottom: '20px', marginLeft: '100px', marginRight: '100px' }}>
                <p>Discover the faces and stories behind your food. From farm to table, explore the passion and dedication of our local farmers. Support quality, support community. Dive in and connect with the heart of agriculture today!</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Button onClick={sortByName}>Sort by Name {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</Button>
                </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', margin: '0 auto', maxWidth: '1200px', padding: '0 16px' }}>
                {error ? (
                    <p>{error}</p>
                ) : (
                    profiles.map(({ id, farm_name, region }) => (
                        <Box key={id} mb={4} width={['100%', '45%', '30%']} flexBasis={['100%', '45%', '30%']} marginLeft="auto" marginRight="auto">
                            <Card direction={{ base: 'column', sm: 'row' }} variant='outline'>
                                <Image
                                    objectFit='cover'
                                    maxW={{ base: '100%', sm: '200px' }}
                                    src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
                                    alt='Caffe Latte'
                                />

                                <Stack>
                                <CardBody style={{ minHeight: '225px' }}>
    <Heading size='sm' style={{ fontSize: 'clamp(12px, 4vw, 14px)' }}>{farm_name}</Heading>
    <Text py='2' style={{ fontSize: 'clamp(12px, 4vw, 14px)' }}>
        Region: {region}
    </Text>
</CardBody>


<CardFooter paddingX={4} paddingY={2}>
    <Button variant='solid' colorScheme='green' paddingX={4} paddingY={2}>
        Learn More
    </Button>
</CardFooter>
                                </Stack>
                            </Card>
                        </Box>
                    ))
                )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Button onClick={handlePrevPage}>Previous</Button>
                <Button onClick={handleNextPage}>Next</Button>
            </div>
            </div>
        </>
    );
}

export default Farmers;
